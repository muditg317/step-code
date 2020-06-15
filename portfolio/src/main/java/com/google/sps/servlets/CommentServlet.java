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

@WebServlet(urlPatterns = {"/comments"})
public class CommentServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    System.out.println("COMMENTS PAGE REQUEST");
    response.setContentType("text/html;");

    JinjavaConfig config = new JinjavaConfig();
    Jinjava jinjava = new Jinjava(config);
    try {
      jinjava.setResourceLocator(
          new FileLocator(new File(this.getClass().getResource("/templates").toURI())));
    } catch (URISyntaxException e) {
      System.err.println("templates dir not found!");
    }

    Map<String, Object> context = new HashMap<>();
    context.put("url", "/comments");

    UserService userService = UserServiceFactory.getUserService();
    if (userService.isUserLoggedIn()) {
      User user = userService.getCurrentUser();
      if (UserAccount.accountExists(user)) {
        context.put("userNickname", UserAccount.getUserNickname(user.getUserId()));
      }
    }

    String template =
        Resources.toString(this.getClass().getResource("/templates/comments.html"), Charsets.UTF_8);

    String renderedTemplate = jinjava.render(template, context);

    response.getWriter().println(renderedTemplate);
  }
}
