export type TileParams = {
  name: string;
  state: string;
  prompt: string;
};

export type TileResponse = TileParams & {
  id: string;
};
