import { BadRequestException } from "@nestjs/common"

export const handleDBErrors = (error: any) => {
    throw new BadRequestException(`Error: ${error}`)
}