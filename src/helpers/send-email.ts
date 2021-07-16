import * as sgmail from "@sendgrid/mail";
import * as config from 'config';

export const send_email = async (data) => {
    sgmail.setApiKey(config.has('mail.key') ? config.get('mail.key') : process.env.MAIL_KEY);
    data['from'] = config.has('mail.from') ? config.get('mail.from') : process.env.MAIL_FROM
    try {
        return await sgmail.send(data);
    }
    catch (e) {
        console.log(e)
    }
}