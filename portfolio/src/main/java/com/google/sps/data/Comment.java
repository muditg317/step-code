package com.google.sps.data;

import com.google.appengine.api.datastore.Entity;

public class Comment {

  private String comment;
  private long keyId;
  private long timestamp;
  private String commenterName;

  public Comment(String comment, long keyId, long timestamp, String commenterName) {
    this.comment = comment;
    this.keyId = keyId;
    this.timestamp = timestamp;
    this.commenterName = commenterName;
  }

  public Comment(Entity entity) {
    this.comment = (String) entity.getProperty("comment");
    this.keyId = (long) entity.getKey().getId();
    this.timestamp = (long) entity.getProperty("timestamp");
    this.commenterName = UserAccount.getUserNickname((String) entity.getProperty("userID"));
  }

  public String getComment() {
    return comment;
  }

  public long getKeyId() {
    return keyId;
  }
}
