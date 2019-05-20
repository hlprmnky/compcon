import store from "@/store";
import { CompendiumItem, Range, Damage, Tag } from '..'

class PilotEquipment extends CompendiumItem {
  private tags: Tag[];

  constructor(id?: string) {
    if (id) {
      const equipmentData = store.getters.getItemById("PilotGear", id);
      super(equipmentData)
      this.tags = equipmentData.tags || [];
    } else {
      super ({
        id: '',
        name: '// EMPTY //',
        description: '',
        item_type: ItemType.None,
        brew: ''
      })
      this.tags = []
    }
  }

  public get Tags(): Tag[] {
    return this.tags;
  }

}

class PilotArmor extends PilotEquipment {
  private hp_bonus: number;
  private speed: number;
  private speed_bonus: number;
  private armor: number;
  private edef: number;
  private edef_bonus: number;
  private evasion: number;
  private evasion_bonus: number;

  constructor(id?: string) {
    super(id);
    const armorData = store.getters.getItemById("PilotGear", id);
    this.hp_bonus = armorData.hp_bonus || 0;
    this.speed = armorData.speed || 0;
    this.speed_bonus = armorData.speed_bonus || 0;
    this.armor = armorData.armor || 0;
    this.edef = armorData.edef || 0;
    this.edef_bonus = armorData.edef || 0;
    this.evasion = armorData.evasion || 0;
    this.evasion_bonus = armorData.evasion_bonus || 0;
  }

  public get HPBonus(): number {
    return this.hp_bonus;
  }

  public get Speed(): number {
    return this.speed;
  }

  public get SpeedBonus(): number {
    return this.speed_bonus;
  }

  public get Armor(): number {
    return this.armor;
  }

  public get EDefense(): number {
    return this.edef;
  }

  public get EDefenseBonus(): number {
    return this.edef_bonus;
  }

  public get Evasion(): number {
    return this.evasion;
  }

  public get EvasionBonus(): number {
    return this.evasion_bonus;
  }
  
}

class PilotWeapon extends PilotEquipment {
  private range: Range;
  private damage: Damage;
  private effect: string;

  constructor(id?: string) {
    super(id);
    const weaponData = store.getters.getItemById("PilotGear", id);
    this.range = new Range(weaponData.range);
    this.damage = new Damage(weaponData.damage);
    this.effect = weaponData.effect || ''
  }

  public get Range(): Range {
    return this.range
  }

  public get Damage(): Damage {
    return this.damage
  }

  public get Effect(): string {
    return this.effect
  }

}

class PilotGear extends PilotEquipment {
  private uses?: number;

  constructor(id?: string) {
    super(id);
    const gearData = store.getters.getItemById("PilotGear", id);
    this.uses = gearData.range || null;
  }

  public get Uses(): number | null {
    return this.uses || null
  }
}

export {
  PilotEquipment,
  PilotArmor,
  PilotWeapon,
  PilotGear,
}