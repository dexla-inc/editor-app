export interface UploadResponse {
  url: string;
}

export interface UploadMultipleResponse {
  files: UploadResponse[];
}

export type FileObj = { [key: string]: any };
