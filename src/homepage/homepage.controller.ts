import { Body, Controller, Get, HttpCode, Post, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HomepageService } from './homepage.service';
import { GetAllFaqDto } from 'src/admin/faq/dto/getAllFaqs.dto';
import { GetAllCityDto } from './dto/getallcity.dto';
import { HomepageDto } from './dto/homepage.dto';

@ApiTags('Home Page')
@Controller()
export class HomepageController {
  constructor(private readonly homePageService: HomepageService) {}
  @Post('get-homepage-list')
  @HttpCode(200)
  async getHomePageList(@Request() request, @Body() homepageDto: HomepageDto) {
    return this.homePageService.getHomePageList(homepageDto);
  }

  @Get('get-contact-list')
  @HttpCode(200)
  async getContactList() {
    return await this.homePageService.getContactList();
  }

  @Get('get-country-list')
  @HttpCode(200)
  async getCountryList() {
    return await this.homePageService.getCountries();
    return await this.homePageService.getCountries();
  }

  @Get('/get-cities-list')
  @HttpCode(200)
  async getAllCities(@Request() request, @Body() getAllCityDto: GetAllCityDto) {
    return this.homePageService.getCityList(getAllCityDto, request);
  }

  @Get('/get-faqs')
  @HttpCode(200)
  async getAllfaq(@Request() request, @Body() getAllfaqDto: GetAllFaqDto) {
    return this.homePageService.getFaqList(getAllfaqDto, request);
  }
}
