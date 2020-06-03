package com.google.sps.data;

/**
 * Class representing a comment on the portfolio.
 *
 * <p>Note: The private variables in this class are converted into JSON.
 */
public class Comment {

  /** List of descriptions of turns, e.g. "Player 1 took 3. New total: 18" */
  private String comment;

  /** The total of the current turn. */
  private long keyId;

  public Comment(String comment, long keyId) {
    this.comment = comment;
    this.keyId = keyId;
  }

  public String getComment() {
    return comment;
  }

  public long getKeyId() {
    return keyId;
  }
}
