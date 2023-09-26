export interface UploadResponse {
  url: string;
}

export interface UploadMultipleResponse {
  files: UploadResponse[];
}
