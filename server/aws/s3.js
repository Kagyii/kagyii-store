import aws from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

env.config();

const ID = process.env.S3_ID;
const SECRET = process.env.S3_SECRET;

const s3 = new aws.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

export const uploadImage = async (image, bucket, segment) => {
  const options = { partSize: 5 * 1024 * 1024, queueSize: 1 };
  if (Array.isArray(image)) {
    const promiseArr = [];

    for (let i = 0; i < image.length; i++) {
      let timestamp = Date.now().toString();

      let params = {
        Bucket: bucket,
        Key: `${segment}${uuidv4()}${timestamp}.jpg`,
        Body: new Buffer.from(image[i], "base64"),
        ACL: "public-read",
        CacheControl: "max-age=604800",
        ContentType: "image/jpeg",
        ContentEncoding: "base64",
      };

      promiseArr.push(saveImage(params, options));
    }

    return Promise.all(promiseArr);
  } else {
    let timestamp = Date.now().toString();
    let params = {
      Bucket: bucket,
      Key: `${segment}${uuidv4()}${timestamp}.jpg`,
      Body: new Buffer.from(image, "base64"),
      ACL: "public-read",
      CacheControl: "max-age=604800",
      ContentType: "image/jpeg",
      ContentEncoding: "base64",
    };

    return saveImage(params, options);
  }
};

export const deleteImage = (image, bucket) => {
  let params = {
    Bucket: bucket,
    Key: image,
  };

  s3.deleteObject(params, function (err, data) {
    if (err) {
      console.log(err);
    }
  });
};

const saveImage = async function (params, options) {
  return new Promise((resolve, reject) => {
    s3.upload(params, options, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve({ location: data.Location, key: data.Key });
    });
  });
};
