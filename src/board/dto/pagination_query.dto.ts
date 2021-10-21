import { IsNotEmpty } from "class-validator";
import { PAGINATION_LIMIT_DTO_VALIDATION_MSG, PAGINATION_OFFSET_DTO_VALIDATION_MSG } from '../../message/message';

export class PaginationQueryDto{
    
    @IsNotEmpty({
        message : PAGINATION_LIMIT_DTO_VALIDATION_MSG
    })

    limit: number;

    @IsNotEmpty({
        message: PAGINATION_OFFSET_DTO_VALIDATION_MSG
    })
    offset: number;
}