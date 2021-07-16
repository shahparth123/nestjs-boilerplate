import { Injectable } from '@nestjs/common';
import { Roles } from 'src/entities/roles.entity';
import { getRepository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { send_email } from '../../helpers/send-email';
import { getEmailVerificationBody, getEmailVerificationSubject } from '../../templates/verifyemail.template';
import { getExpertInvitationBody, getExpertInvitationSubject } from '../../templates/inviteexpert.template';
import { getForgotPasswordBody, getForgotPasswordSubject } from '../../templates/forgotpassword.template';

@Injectable()
export class UserService {

    async findByEmail(email) {
        const userRepo = getRepository(User);
        const query = userRepo.createQueryBuilder('user')
            .where("user.email=:email", {
                email: email
            })
            .andWhere("is_delete=false");

        return await query.getOne();
    }

    async findById(userid) {

        const userRepo = getRepository(User);
        const query = userRepo.createQueryBuilder('user')
            .where("user.id=:userid", {
                userid: userid
            })
            .andWhere("is_delete=false");

        return await query.getOne();
    }

    async generatePermissions(user) {

        const roles = user.roles.split(',');
        const additionalPermissions = user.additionalPermissions.split(',')
        console.log(roles);
        const userRepo = getRepository(Roles);
        const query = userRepo.createQueryBuilder('roles')
            .where("roles.roleName IN(:...roles)", {
                roles: roles
            });
        const permissionsArray = await query.getMany();
        const permissions = [].concat(...permissionsArray.map(item => {
            const rolePermission = item.permissions.split(",");
            return rolePermission;
        }));

        return Array.from(new Set([...permissions, ...additionalPermissions]));
    }

    async register(body) {
        const password = await bcrypt.hash(
            body.password,
            10,
        );
        body.password = password;
        const userRepo = getRepository(User);
        body.code = uuid();

        const user = await userRepo.save(body);

        await send_email({
            to: user.email,
            html: getEmailVerificationBody(user),
            subject: getEmailVerificationSubject(user)
        })
        return body;
    }

    async inviteExpert(body) {
        const password = await bcrypt.hash(
            body.password,
            10,
        );
        body.password = password;
        body.role = "expert"
        const userRepo = getRepository(User);
        const user = await userRepo.save(body);
        await send_email({
            to: user.email,
            html: getExpertInvitationBody(user),
            subject: getExpertInvitationSubject(user)
        })
        return body;
    }

    async forgotPassword(user) {
        const userRepo = getRepository(User);
        const emailCode = uuid();
        await userRepo.update({ id: user.id }, { code: emailCode });
        user.code = emailCode;
        await send_email({
            to: user.email,
            html: getForgotPasswordBody(user),
            subject: getForgotPasswordSubject(user)
        })
    }

    async resetPassword(data) {
        const password = await bcrypt.hash(
            data.password,
            10,
        );
        data.password = password;
        const userRepo = getRepository(User);
        const result = await userRepo.update({ email: data.email, code: data.code }, { code: uuid(), password: data.password });
        return {
            status: result.affected
        };
    }

    async changePassword(user, data) {

        const isMatch = await bcrypt.compare(data.old_password, user.password);

        if (isMatch) {
            const new_password = await bcrypt.hash(
                data.new_password,
                10,
            );
            const userRepo = getRepository(User);
            const result = await userRepo.update({ id: user.id }, { password: new_password });
            return { status: result.affected };
        }
        else {
            return { status: 0 }
        }
    }

    async updateStatus(user_id, data) {
        const userRepo = getRepository(User);
        await userRepo.update({ id: user_id }, { status: data.status });
    }

    async verifyEmail(user_id, data) {
        const userRepo = getRepository(User);
        const result = await userRepo.update({ id: user_id, code: data.code }, { status: 2, code: uuid() });
        return result.affected;
    }

    async updateProfile(user_id, data) {
        const userRepo = getRepository(User);
        const updateObj = {}
        if (data.fullName) {
            updateObj['fullName'] = data.fullName
        }
        if (data.profilePic) {
            updateObj['profilePic'] = data.profilePic
        }
        if (data.firebaseId) {
            updateObj['firebaseId'] = data.firebaseId
        }
        if (data.mobile) {
            updateObj['mobile'] = data.mobile
        }
        await userRepo.update({ id: user_id }, updateObj);
        return;
    }

    async expertList(user, query) {
        return
    }

    async userList(user, query) {
        return
    }
}

