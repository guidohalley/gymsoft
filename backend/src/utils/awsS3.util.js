import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
  } from "@aws-sdk/client-s3";
  import fs from "fs";
  import mime from "mime-types";
  
  const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
  const AWS_BUCKET_REGION = process.env.AWS_BUCKET_REGION;
  const AWS_PUBLIC_KEY = process.env.AWS_PUBLIC_KEY;
  const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
  
  const client = new S3Client({
    region: AWS_BUCKET_REGION,
    credentials: { accessKeyId: AWS_PUBLIC_KEY, secretAccessKey: AWS_SECRET_KEY },
  });
  
  export async function upLoadFile(file) {
    try {
      if (!file || !fs.existsSync(file.path)) {
        throw new Error("El archivo no existe");
      }
  
      const stream = fs.createReadStream(file.path);
      const key = `videos/${file.filename}`;
      const contentType = mime.lookup(key);
  
      const uploadParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: key,
        Body: stream,
        ContentType: contentType || "application/octet-stream",
      };
  
      const command = new PutObjectCommand(uploadParams);
      const result = await client.send(command);
  
      await fs.promises.unlink(file.path);
  
      const imageUrl = `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/${key}`;
  
      return { ...result, imageUrl };
    } catch (error) {
      console.error("Error al subir el archivo a AWS", error);
      throw new Error("Error al subir el archivo a AWS");
    }
  }
  
  export async function deleteFile(imageUrl) {
    try {
      const urlParts = imageUrl.split(`${AWS_BUCKET_NAME}.s3.amazonaws.com/`);
      if (urlParts.length < 2) {
        throw new Error("URL de S3 invalida");
      }
      const key = urlParts[1];
  
      const deleteParams = {
        Bucket: AWS_BUCKET_NAME,
        Key: key,
      };
  
      const command = new DeleteObjectCommand(deleteParams);
      const result = await client.send(command);
  
      return result;
    } catch (error) {
      console.error("Error al eliminar el archivo", error);
      throw new Error("Error al eliminar el archivo");
    }
  }
  