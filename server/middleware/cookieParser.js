const parseCookies = (req, res, next) => {
  //INPUT: cookies, access cookies on an incoming req
  //LOGIC: parse cookies into object {}
  //OUTPUT req.cookies = { hash: reu98w0rj4i32ojog };
  //auth.createSESSION checks req.cookies
  //LOOK FOR HASH AND COMPARE TO DB HASH TABLE...
  //CHECK COOKIE AND FIND HASH IF ANY??
  //CREATE HASH ATTACH COOKIE TO RES.SEND();

  if (req.headers.cookie) {
    let cookiesArr = req.headers.cookie.split(';');
    let cookies = {}
    cookiesArr.forEach(cookieEntry => {
      let key = cookieEntry.split('=')[0].trim();
      let token = cookieEntry.split('=')[1];
      cookies[key] = token;
    });
    req.cookies = cookies;
    next();
  } else {
    req.cookies = {};
    next();
  }
};

module.exports = parseCookies;