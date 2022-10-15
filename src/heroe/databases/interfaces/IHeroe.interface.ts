/* eslint-disable prettier/prettier */
export interface IHeroe {
  id: number;
  name: string;
  description: string;
  image: {
    path: string;
    extension: string;
  };
}
