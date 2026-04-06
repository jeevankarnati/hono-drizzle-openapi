import * as HTTP_STATUS_PHRASES from "@/helpers/http-status-phrases";
import createMessageObjectSchema from "./create-message-object";

const notFoundSchema = createMessageObjectSchema(HTTP_STATUS_PHRASES.NOT_FOUND);

export default notFoundSchema;
