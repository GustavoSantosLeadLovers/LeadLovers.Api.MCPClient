export type TextContent = {
  type: 'text';
  text: string;
};

export type ResourceContent = {
  type: 'resource';
  resource: {
    uri: string;
    mimeType: string;
    text: string;
  };
};
