import { Body, ConflictException, Controller, Get, HttpException, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDTO } from './dtos/register-user.dto';
import { RBAC } from '../../decorator/rbac.decorator';
import { ForgotPasswordDTO } from './dtos/forgot-password.dto';
import { ResetPasswordDTO } from './dtos/reset-password.dto';
import { JwtAuthGuard } from '../../guards/jwt/jwt-auth-guard.guard';
import { ChangePasswordDTO } from './dtos/change-password.dto';
import { InviteUserDTO } from './dtos/invite-user.dto';
import { VerifyEmailDTO } from './dtos/verify-email.dto';
import { ApiTags } from '@nestjs/swagger';

/**
 * User Flow:
 * 1. Registration -> Verify email -> login -> approve by admin
 * 2. Forget password -> verify email -> reset password -> login
 * 3. Invite user -> reset password -> login
 * 4. Update profile
 * 5. Enable disable user
 */

@ApiTags("User")
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @RBAC('admin', 'user', 'expert')
    @Get('profile')
    async profile(@Request() req) {
        return this.userService.findById(req.user.id);
    }

    @Post('register')
    async Register(
        @Body() body: RegisterUserDTO,
    ) {

        let user = await this.userService.findByEmail(body.email);
        if (user) {
            throw new ConflictException({ statusCode: 409, message: 'Username already exist.' });
        }
        user = await this.userService.register(body);

        return {
            status: "Success"
        };
    }


    @Post('forgot-password')
    async forgotPassword(
        @Body() body: ForgotPasswordDTO,
    ) {

        let user = await this.userService.findByEmail(body.email);
        console.log(user);
        if (user) {
            await this.userService.forgotPassword(user);
        }
        return {
            message: "Reset password link sent."
        };
    }

    @Post('reset-password')
    async resetPassword(
        @Body() body: ResetPasswordDTO,
    ) {

        let user = await this.userService.resetPassword(body);
        return user;
    }

    @Post('verify-email')
    async verifyEmail(
        @Body() body: VerifyEmailDTO,
    ) {
        let user = await this.userService.findByEmail(body.email);
        console.log(user);
        if (user) {
            const result = await this.userService.verifyEmail(user.id, body);
            return { status: result }
        }
        else {
            return { status: 0 }
        }
    }

    @RBAC('user', 'admin', 'expert')
    @Post('change-password')
    async changePassword(
        @Body() body: ChangePasswordDTO, @Request() req
    ) {

        const user = await this.userService.findById(req.user.id)
        if (user) {
            return await this.userService.changePassword(user, body);
        }
        else {
            return { status: 0 }
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('update-profile')
    async updateProfile(
        @Body() body: ChangePasswordDTO, @Request() req
    ) {
        if (req.user.id) {
            return await this.userService.updateProfile(req.user.id, body);
        }
    }

    @RBAC('admin')
    @Put('approve-user/:id')
    async approveUser(
        @Param('id') id: number, @Request() req
    ) {
        return await this.userService.updateStatus(id, { status: 3 });
    }

    @RBAC('admin')
    @Put('suspend-user/:id')
    async suspendUser(
        @Param('id') id: number, @Request() req
    ) {
        return await this.userService.updateStatus(id, { status: 0 });
    }

    @RBAC("admin")
    @Post('invite-expert')
    async inviteExpert(
        @Body() body: InviteUserDTO, @Request() req
    ) {

        const user = await this.userService.findByEmail(body.email)
        if (!user) {
            return await this.userService.inviteExpert(body);
        }
        else {
            throw new ConflictException({ statusCode: 409, message: 'User already exist.' });
        }
    }

    @RBAC('admin', 'expert')
    @Get('user-list')
    async userList(
        @Query() query: any, @Request() req
    ) {
        return await this.userService.userList(req.user, query);
    }

    @RBAC('admin')
    @Get('expert-list')
    async expertList(
        @Query() query: any, @Request() req
    ) {
        return await this.userService.expertList(req.user, query);
    }
}
