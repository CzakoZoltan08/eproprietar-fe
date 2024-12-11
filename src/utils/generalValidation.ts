export const generalValidation = (
  schema: any,
  input: any,
  name?: string,
  abortEarly = false,
): string | undefined | null | { [key: string]: any } => {
  const results = schema.validate(input, { abortEarly });

  if (results.error && name) {
    const error = results.error.details.find(
      (obj: any) => obj.path[0] === name,
    );
    return error?.message;
  }

  if (results.error && !name) {
    let errorsObj: { [key: string]: any } | null = null;
    results.error.details.forEach((detail: any) => {
      errorsObj = {
        ...(errorsObj || {}),
        [detail.path[0]]: detail.message,
      };
    });

    return errorsObj;
  }

  return null;
};
