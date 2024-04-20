import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ExistingUserDTO } from './dto/existingUser.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post('exist')
    async userExist(@Body() existingUserDTO : ExistingUserDTO) {
        const {userEmail} = existingUserDTO;
        const {_id, email, password, role} = await this.userService.findOne(userEmail);
        return {_id, email, password, role};
    }
}
