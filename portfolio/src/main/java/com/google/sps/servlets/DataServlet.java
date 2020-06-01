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

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.FetchOptions;

import java.util.List;
import java.util.ArrayList;

/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String urlKey = request.getParameter("key");
        long id;
        Key commentEntityKey = null;
        if (urlKey != null) {
            id = Long.parseLong(urlKey);
            commentEntityKey = KeyFactory.createKey("Comment", id);
        }
        
        Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        PreparedQuery results = datastore.prepare(query);

        List<String> comments = new ArrayList<>();
        boolean foundUrlKeyBasedComment = commentEntityKey == null;
        String maxCommentParam = request.getParameter("maxComments");
        int maxComments = maxCommentParam != null ? Integer.parseInt(maxCommentParam) : Integer.MAX_VALUE;
        for (Entity entity : results.asIterable(FetchOptions.Builder.withLimit(maxComments))) {
            String comment = (String) entity.getProperty("comment");
            comments.add(comment);
            if (!foundUrlKeyBasedComment && entity.getKey().equals(commentEntityKey)) {
                foundUrlKeyBasedComment = true;
            }
            if (comments.size() >= maxComments) {
                break;
            }
        }
        if (!foundUrlKeyBasedComment) {
            Entity urlBasedComment;
            try {
                urlBasedComment= datastore.get(commentEntityKey);
                comments.add(0, (String) urlBasedComment.getProperty("comment"));
            } catch (EntityNotFoundException e) { }
        }
        while (comments.size() > maxComments) {
            comments.remove(maxComments);
        }

        response.setContentType("application/json;");
        response.getWriter().println(new Gson().toJson(comments));
    }

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String comment = request.getParameter("comment");
        Key key = null;
        if (comment != null && comment.length() > 0) {
            Entity commentEntity = new Entity("Comment");
            commentEntity.setProperty("comment", comment);
            commentEntity.setProperty("timestamp", System.currentTimeMillis());
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
            datastore.put(commentEntity);
            key = commentEntity.getKey();
        }
        response.setContentType("application/json;");
        // String redirectURL = "/data";
        if (key != null) {
            // redirectURL += "?key="+key.getId();
            response.getWriter().println("{\"key\": " + key.getId() + "}");
        } else {
            response.getWriter().println("{}");
        }
        // response.sendRedirect(redirectURL);
    }

}
