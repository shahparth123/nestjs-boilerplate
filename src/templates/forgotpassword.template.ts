export const getForgotPasswordSubject = (data) => {
    return `Reset Password`
}
export const getForgotPasswordBody = (data) => {
    return `<p>Hello ${data.fullName},</p>
    <p>Please click here for verifying your email id by clicking following link
    <center><a href="${"https://frontendurl.com/reset?email=" + data.email + "&code=" + data.code}">Verify Email</a></center>
     or copying following link:</p>
     ${"https://frontendurl.com/reset?email=" + data.email + "&code=" + data.code}
    `;
}