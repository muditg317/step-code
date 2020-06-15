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
import com.google.sps.data.UserAccount;
import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet(urlPatterns = {"/auth-url"})
public class AuthURLServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String entryURLPath = request.getParameter("entryURLPath");
    System.out.println("GET AUTH URL FOR: " + entryURLPath);

    UserService userService = UserServiceFactory.getUserService();
    if (userService.isUserLoggedIn()) {
      User user = userService.getCurrentUser();
      if (UserAccount.accountExists(user)) {
        writeToResponse(response, "logout", userService.createLogoutURL(entryURLPath));
        return;
      }
      writeToResponse(response, "create account", "/create-account?redirect=" + entryURLPath);
      return;
    }
    writeToResponse(
        response, "login", userService.createLoginURL("/authenticate?redirect=" + entryURLPath));
  }

  private void writeToResponse(HttpServletResponse response, String type, String url)
      throws IOException {
    response.setContentType("application/json;");
    String jsonString = "{" + "\"type\": \"" + type + "\"," + "\"url\": \"" + url + "\"" + "}";
    response.getWriter().println(jsonString);
  }
}
