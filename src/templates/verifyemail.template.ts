export const getEmailVerificationSubject = (data) => {
    return `Confirm your email address`
}
export const getEmailVerificationBody = (data) => {
    return `<p>Hello ${data.fullName},</p>
    <p>Please click here for verifying your email id by clicking following link
    <center><a href="${"https://frontendurl.com/verify?email=" + data.email + "&code=" + data.code}">Verify Email</a></center>
     or copying following link:</p>
     ${"https://frontendurl.com/verify?email=" + data.email + "&code=" + data.code}
    `;
}