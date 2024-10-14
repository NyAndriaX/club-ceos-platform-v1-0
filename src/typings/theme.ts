export type ThemeInput = {
  title: string;
  description?: string;
};

export type ThemeOutput = {
  id: number;
  title: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};
