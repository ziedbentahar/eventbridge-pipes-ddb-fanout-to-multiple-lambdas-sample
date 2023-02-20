export const handler = async (event: any) => {
  console.log("Hello Lambda 2");

  console.log(JSON.stringify(event));
  return {
    statusCode: 200,
  };
};
