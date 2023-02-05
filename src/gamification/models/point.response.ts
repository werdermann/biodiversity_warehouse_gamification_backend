/**
 * Response object that contains the gained points of the user based on the information of the sighting and the current
 * count of comments.
 */
export class PointResponse {
  public gainedPoints: number;
  public commentsCount: number;
}
