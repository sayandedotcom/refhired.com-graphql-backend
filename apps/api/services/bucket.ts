class BucketService {
  public static async getObject(key: string) {
    // return await getObjectUrl(key);
    return "hiii from getObject";
  }
  public static async putObject(key: string, contentType: string) {
    return "hiii from putObject";
    // return await putObjectUrl(key, contentType);
  }
  public static async deleteObject(key: string) {
    return "hiii";

    // return await deleteObjectUrl(key);
  }
}

export default BucketService;
