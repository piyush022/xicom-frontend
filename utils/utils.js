import moment from "moment";
import mime from "mime-types";

export function verifyAge(dob) {
  const eighteenYearsAgo = moment().subtract(18, "years");
  if (moment(dob).isAfter(eighteenYearsAgo)) {
    return false;
  } else {
    return true;
  }
}

export function checkFileType(file, fileType) {
  console.log("fileType", fileType);

  const mimeType = mime.lookup(file.name);
  console.log("mime", mimeType);

  if (mimeType.includes(fileType)) {
    console.log("true");

    return true;
  } else {
    console.log("false");
    return false;
  }
}
