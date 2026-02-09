import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { type EntryContext, ServerRouter } from "react-router";
import { logger } from "~/lib/logger.server";

const log = logger.child({ component: "ssr" });

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext,
) {
  const body = await renderToReadableStream(
    <ServerRouter context={entryContext} url={request.url} />,
    {
      signal: request.signal,
      onError(error: unknown) {
        log.error({ err: error }, "SSR render error");
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get("user-agent") || "")) {
    await body.allReady;
  }

  responseHeaders.set("Content-Type", "text/html");

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
