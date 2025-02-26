import {
  Controller,
  Get,
  Delete,
  Param,
  Req,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import ApiResponseClass from 'src/common/responses/ApiResponse';
import { SessionDto } from './dto/session.dto';

@ApiTags('Sessions')
@ApiBearerAuth()
@Controller('sessions')
@UseGuards(JwtAuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all user sessions with current session marked' })
  @ApiResponse({ status: 200, description: 'Returns all sessions', type: [SessionDto] })
  async getAllSessions(@Req() req, @Res() res: Response) {
    const userId = req.user.id;
    const currentSessionToken = req.cookies?.refresh_token;
    
    const sessions = await this.sessionService.getAllSessions(userId, currentSessionToken);
    
    return res.status(HttpStatus.OK).json(new ApiResponseClass({
      sessions
    }));
  }

  @Delete()
  @ApiOperation({ summary: 'Delete all sessions except current one' })
  @ApiResponse({ status: 200, description: 'Returns number of deleted sessions' })
  async deleteAllSessions(@Req() req, @Res() res: Response) {
    const userId = req.user.id;
    const currentSessionToken = req.cookies?.refresh_token;
    
    const result = await this.sessionService.deleteAllSessionsExceptCurrent(
      userId, 
      currentSessionToken
    );
    
    return res.status(HttpStatus.OK).json(new ApiResponseClass({
      message: `Successfully deleted ${result.count} sessions`,
      deletedCount: result.count
    }));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific session (cannot delete current session)' })
  @ApiResponse({ status: 200, description: 'Session deleted successfully' })
  @ApiResponse({ status: 403, description: 'Cannot delete current session or unauthorized' })
  @ApiResponse({ status: 404, description: 'Session not found' })
  async deleteSession(@Param('id') id: string, @Req() req, @Res() res: Response) {
    const userId = req.user.id;
    const currentSessionToken = req.cookies?.refresh_token;
    
    await this.sessionService.deleteSession(userId, id, currentSessionToken);
    
    return res.status(HttpStatus.OK).json(new ApiResponseClass({
      message: 'Session deleted successfully'
    }));
  }
}
