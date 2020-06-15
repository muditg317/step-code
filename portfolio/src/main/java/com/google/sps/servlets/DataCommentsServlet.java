// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.google.sps.data.Comment;
import com.google.sps.data.UserAccount;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/data-comments")
public class DataCommentsServlet extends HttpServlet {

  private static final int DEFAULT_MAX_COMMENTS = 100;

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    List<Comment> comments =
        getComments(getMaxComments(request), getKeyFromRequest(request, "Comment"));

    response.setContentType("application/json;");
    response.getWriter().println(new Gson().toJson(comments));
  }

  private Key getKeyFromRequest(HttpServletRequest request, String kind) {
    String urlKey = request.getParameter("key");
    long id;
    Key entityKey = null;
    if (urlKey != null) {
      id = Long.parseLong(urlKey);
      entityKey = KeyFactory.createKey(kind, id);
    }
    return entityKey;
  }

  private int getMaxComments(HttpServletRequest request) {
    String maxCommentParam = request.getParameter("maxComments");
    return maxCommentParam != null ? Integer.parseInt(maxCommentParam) : DEFAULT_MAX_COMMENTS;
  }

  private List<Comment> getComments(int maxComments, Key mostRecentCommentKey) {
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);
    List<Comment> comments = new ArrayList<>(maxComments);
    for (Entity entity : results.asIterable(FetchOptions.Builder.withLimit(maxComments))) {
      comments.add(new Comment(entity));
      if (comments.size() >= maxComments) {
        break;
      }
    }
    if (mostRecentCommentKey != null) {
      ensureIdPresentInCommentList(comments, mostRecentCommentKey);
    }

    while (comments.size() > maxComments) {
      comments.remove(maxComments);
    }
    return comments;
  }

  private void ensureIdPresentInCommentList(List<Comment> comments, Key requiredKey) {
    if (comments.stream().noneMatch(comment -> comment.getKeyId() == requiredKey.getId())) {
      DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
      try {
        Entity keyBasedEntity = datastore.get(requiredKey);
        comments.add(new Comment(keyBasedEntity));
      } catch (EntityNotFoundException e) {
      }
    }
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String comment = request.getParameter("comment");
    Key key = null;
    UserService userService = UserServiceFactory.getUserService();
    if (!userService.isUserLoggedIn()) {
      response.setStatus(401); // unauthorized
      return;
    }
    User user = userService.getCurrentUser();
    if (!UserAccount.accountExists(user)) {
      response.setStatus(401); // unauthorized
      return;
    }
    if (comment != null && comment.length() > 0) {
      Entity commentEntity = new Entity("Comment");
      commentEntity.setProperty("comment", comment);
      commentEntity.setProperty("timestamp", System.currentTimeMillis());
      commentEntity.setProperty("userID", user.getUserId());
      DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
      datastore.put(commentEntity);
      key = commentEntity.getKey();
    }
    response.setContentType("application/json;");
    if (key != null) {
      response.getWriter().println("{\"key\": " + key.getId() + "}");
    } else {
      response.getWriter().println("{}");
    }
  }

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response)
      throws IOException {
    Query query = new Query("Comment");

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    PreparedQuery results = datastore.prepare(query);

    datastore.delete(
        StreamSupport.stream(results.asIterable().spliterator(), false)
            .map(Entity::getKey)
            .collect(Collectors.toList()));
  }
}
