const parseCookies = (req, res, next) => {
  //INPUT: cookies, access cookies on an incoming req
  //CHECK COOKIE AND FIND HASH IF ANY??
  //GET HASH AND CHECK VS SERVER HASH TABLE???
  //LOGIC: parse cookies into object {}
  //OUTPUT req.cookies = { hash: reu98w0rj4i32ojog };
  //auth.createSESSION checks req.cookies
  //LOOK FOR HASH AND COMPARE TO DB HASH TABLE...

  //CREATE HASH ATTACK COOKIE TO RES.SEND();

  console.log('Cookie Parser Initialized');
  console.log('Cookie Parser Initialized');
  console.log('Cookie Parser Initialized');
  console.log('Cookie Parser Initialized');
  console.log(req.headers);
  if (req.headers.cookie) {
    let cookiesArr = req.headers.cookie.split(';');
    cookiesArr.forEach(cookieEntry => {
      let key = cookieEntry.split('=')[0].trim();
      let value = cookieEntry.split('=')[1];
      req.cookies[key] = value;
      res.cookies[key] = value;
    });
    console.log('AFTER PARSING');
    console.log(req.cookies);
    next();
  } else {
    console.log('we DONT WANT TO BE HERE');
    console.log('we DONT WANT TO BE HERE');
    console.log('we DONT WANT TO BE HERE');
    console.log('we DONT WANT TO BE HERE');
    req.cookies = {};
    next();
  }
};


module.exports = parseCookies;