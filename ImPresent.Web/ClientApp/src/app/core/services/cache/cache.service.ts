import { Injectable } from '@angular/core';
import { PromotionDto } from 'src/app/shared/models/model';

@Injectable({
  providedIn: 'root'
})
export class CacheService {

  promotions: Map<string, PromotionDto> = new Map();

  constructor() { }

  getPromotion(id: string): PromotionDto | undefined {
    return this.promotions.get(id);
  }

  setPromotion(promotion: PromotionDto): void {
    if (promotion != null) {
      this.promotions.set(promotion.id, promotion);
    }
  }
}
