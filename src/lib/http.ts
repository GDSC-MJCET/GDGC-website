import axios from "axios";

// Response of an axios failure, or undefined for any other kind of error.
export const axiosResponse = (err: unknown) =>
  axios.isAxiosError(err) ? err.response : undefined;
