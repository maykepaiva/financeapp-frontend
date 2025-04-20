const jwtDecode = require("jwt-decode");

const token ="eyJhbGciOiJIUzI1NiJ9.eyJ1c3VhcmlvSWQiOjEsInN1YiI6Im1heWtlQGdtYWlsLmNvbSIsImlhdCI6MTc0NDM0NzM5MywiZXhwIjoxNzQ1MjExMzkzfQ.wndNt3AfdBEzL69BH3iPd2dBTCXHCghyepHI2OcuGdc";

const decoded = jwtDecode(token);

console.log("Token decodificado:", decoded);
