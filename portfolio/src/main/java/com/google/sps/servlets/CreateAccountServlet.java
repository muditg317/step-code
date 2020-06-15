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
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import com.google.sps.data.UserAccount;
import com.hubspot.jinjava.Jinjava;
import com.hubspot.jinjava.JinjavaConfig;
import com.hubspot.jinjava.loader.FileLocator;
import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(urlPatterns = {"/create-account"})
public class CreateAccountServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String redirectPath = getRedirect(request);
    System.out.println("CREATE ACCOUNT | REDIRECT TO: " + redirectPath);

    UserService userService = UserServiceFactory.getUserService();
    if (userService.isUserLoggedIn()) {
      User user = userService.getCurrentUser();
      if (UserAccount.accountExists(user)) {
        response.sendRedirect(redirectPath);
        return;
      }

      JinjavaConfig config = new JinjavaConfig();
      Jinjava jinjava = new Jinjava(config);
      try {
        jinjava.setResourceLocator(
            new FileLocator(new File(this.getClass().getResource("/templates").toURI())));
      } catch (URISyntaxException e) {
        System.err.println("templates dir not found!");
      }

      Map<String, Object> context = new HashMap<>();
      context.put("url", "/create-account");

      String template =
          Resources.toString(
              this.getClass().getResource("/templates/create-account.html"), Charsets.UTF_8);

      String renderedTemplate = jinjava.render(template, context);

      response.getWriter().println(renderedTemplate);

      return;
    }
    response.sendRedirect(userService.createLoginURL("/authenticate?redirect=" + redirectPath));
  }

  private String getRedirect(HttpServletRequest request) {
    String redirectPath = request.getParameter("redirect");
    return redirectPath != null ? redirectPath : "/";
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String nickname = request.getParameter("nickname");
    System.out.println("REGISTER: " + nickname);
    if (nickname == null || nickname.length() <= 0) {
      response.setStatus(412); // precondition failed
      return;
    }
    UserService userService = UserServiceFactory.getUserService();
    if (userService.isUserLoggedIn()) {
      User user = userService.getCurrentUser();
      if (UserAccount.accountExists(user)) {
        response.setStatus(202); // accepted
        return;
      }
      if (UserAccount.nicknameAvailable(nickname)) {
        response.setStatus(201); // created
        Entity newUserEntity = new Entity("UserAccount");
        newUserEntity.setProperty("userID", user.getUserId());
        newUserEntity.setProperty("email", user.getEmail());
        newUserEntity.setProperty("nickname", nickname);
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        datastore.put(newUserEntity);
        return;
      }
      response.setStatus(409); // conflict
      return;
    }
    response.setStatus(401); // unauthorized
  }
}
