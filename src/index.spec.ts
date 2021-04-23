import { rotiroCookie } from './index';

describe('RotiroCookie', () => {
  let apiRequest: any;
  let apiResponse: any;
  beforeEach(() => {
    apiRequest = { headers: {}, meta: {} };
    apiResponse = { headers: {} };
  });

  describe('Parsing Cookies', () => {
    it('Add responseCookie Object to meta', () => {
      rotiroCookie(apiRequest);
      expect(apiRequest.meta).toEqual({cookies:{}, responseCookies: {} });
    });

    it('Handle invalid cookie string', () => {
      apiRequest.headers.cookie = {} as any;
      rotiroCookie(apiRequest);
      expect(apiRequest.meta).toEqual({cookies:{}, responseCookies: {} });
    });

    it('Reads cookies from request', () => {
      apiRequest.headers.cookie = 'name=value; name2=value2; name3=value3';
      rotiroCookie(apiRequest);
      expect(apiRequest.meta).toEqual({
        cookies: {
          name: 'value',
          name2: 'value2',
          name3: 'value3'
        },
        responseCookies: {}
      });
    });
  });

  describe('Writing Cookies', () => {
    it('Does not update set-cookie if not cookies set', () => {
      rotiroCookie(apiRequest, apiResponse);
      expect(apiResponse.headers).toEqual({});
    });

    it('Does not update set-cookie if no cookies added', () => {
      rotiroCookie(apiRequest);
      rotiroCookie(apiRequest, apiResponse);
      expect(apiResponse.headers).toEqual({});
    });

    it('Add a single cookie', () => {
      rotiroCookie(apiRequest);
      apiRequest.meta.responseCookies.SomeCookie = { value: 'red' };
      rotiroCookie(apiRequest, apiResponse);
      expect(apiResponse.headers).toEqual({ 'Set-Cookie': ['SomeCookie=red'] });
    });

    it('Add a multiple cookies', () => {
      rotiroCookie(apiRequest);
      apiRequest.meta.responseCookies.SomeCookie = { value: 'red' };
      apiRequest.meta.responseCookies.SomeOtherCookie = { value: 'green' };
      rotiroCookie(apiRequest, apiResponse);
      expect(apiResponse.headers).toEqual({
        'Set-Cookie': ['SomeCookie=red', 'SomeOtherCookie=green']
      });
    });

    it('Add a cookie with options', () => {
      rotiroCookie(apiRequest);
      apiRequest.meta.responseCookies.SomeCookie = {
        value: 'red',
        domain: 'www.some.com',
        expires: new Date('2022-01-01'),
        httpOnly: true,
        path: '/',
        sameSite: true,
        secure: true
      };
      rotiroCookie(apiRequest, apiResponse);
      expect(apiResponse.headers).toEqual({
        'Set-Cookie': [
          'SomeCookie=red; Domain=www.some.com; Path=/; Expires=Sat, 01 Jan 2022 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict'
        ]
      });
    });

    it('Add a cookie with maxAge options', () => {
      rotiroCookie(apiRequest);
      apiRequest.meta.responseCookies.SomeCookie = {
        value: 'red',
        maxAge: 3300
      };
      rotiroCookie(apiRequest, apiResponse);
      expect(apiResponse.headers).toEqual({
        'Set-Cookie': ['SomeCookie=red; Max-Age=3300']
      });
    });
  });

  //
  //
  //
  // it('', () => {});
});
