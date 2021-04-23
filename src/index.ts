import * as Cookie from 'cookie';
import { CookieSerializeOptions } from 'cookie';
import { ApiRequest, ApiResponse } from 'rotiro';

export function rotiroCookie(
  apiRequest: ApiRequest,
  apiResponse?: ApiResponse
) {
  // read and parse set-cookie ... , , ,
  // response cookie....

  const populatingRequest: boolean = typeof apiResponse === 'undefined';
  if (populatingRequest) {
    apiRequest.meta.responseCookies = {};
    // Read any cookies from the header and add them to the apiRequest
    apiRequest.meta.cookies = getRequestCookies(apiRequest.headers.cookie);

  } else{
    // manipulate the response headers and push any cookies to the response
    writeCookiesToResponseHeader(apiRequest, apiResponse as ApiResponse);
  }
}

function getRequestCookies(cookieHeaderValue: string): Record<string, string> {
  if (cookieHeaderValue) {
    try {
      return Cookie.parse(cookieHeaderValue);
    } catch (ex) {
      return {};
    }
  }
  return {};
}

function writeCookiesToResponseHeader(
  apiRequest: ApiRequest,
  apiResponse: ApiResponse
) {
  const responseCookies: Record<string, RotiroCookie> =
    apiRequest.meta.responseCookies;

  if (responseCookies) {
    const cookieNames: string[] = Object.keys(responseCookies);

    const setCookieHeader: string[] = [];
    for (const name of cookieNames) {
      const cookieOptions: RotiroCookie = responseCookies[name];
      const cookieText: string = Cookie.serialize(
        name,
        cookieOptions.value,
        cookieOptions as CookieSerializeOptions
      );
      setCookieHeader.push(cookieText);
    }
    if (setCookieHeader.length) {
      // pass an array of options to the header
      apiResponse.headers['Set-Cookie'] = setCookieHeader;
    }
  }
}

interface RotiroCookie extends RotiroCookieOptions {
  value: any;
}

interface RotiroCookieOptions {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: true | false | 'lax' | 'strict' | 'none';
  secure?: boolean;
  encode?(value: string): string;
}
