export default (message: string, statusCode: number, validations?: any, extraProps?: string|number)=> {
    const error = new Error() as any;
    error.message = message,
    error.statusCode = statusCode;
    error.validations = validations || [];
    error.extraProps = extraProps
    throw error;
}