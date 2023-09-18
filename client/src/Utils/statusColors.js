// statusColors.js

export function colorStatus(status) {
    if (status === "Accepted") {
      return "success";
    }
  
    if (status === "Rejected") {
      return "error";
    }
  
    if (status === "Feedback Provided") {
      return "warning";
    }
  
    return "secondary";
  }
  