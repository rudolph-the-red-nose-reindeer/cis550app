module.exports = {
  user: "cis550admin",

  // Get the password from the environment variable
  // NODE_ORACLEDB_PASSWORD.  The password could also be a hard coded
  // string (not recommended), or it could be prompted for.
  // Alternatively use External Authentication so that no password is
  // needed.
  password: "Vhr8z*U{.8cr",

  // For information on connection strings see:
  // https://oracle.github.io/node-oracledb/doc/api.html#connectionstrings
  connectString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=cis550project.c2khsgz1epv9.us-east-1.rds.amazonaws.com)(PORT=1521))(CONNECT_DATA=(SID=CIS550PR)))",

};

