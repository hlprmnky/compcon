import { LicensedItem, Tag } from '@/class'

abstract class MechEquipment extends LicensedItem {
  protected sp: number
  protected tags: ITagData[]
  private _effect: string
  private _integrated: boolean
  private _uses: number
  private _destroyed: boolean

  public constructor(itemData: any) {
    super(itemData)
    this.sp = itemData.sp || 0
    this.tags = itemData.tags
    this._effect = itemData._effect
    this._integrated = itemData.talent_item || itemData.frame_id || false
    this._uses = this.MaxUses
    this._destroyed = false
  }

  public get Tags(): Tag[] {
    return Tag.Deserialize(this.tags)
  }

  public get Effect(): string {
    return this._effect
  }

  public get IsIntegrated(): boolean {
    return this._integrated
  }

  public get IsUnique(): boolean {
    return this.Tags.some(x => x.IsUnique)
  }

  public get IsLimited(): boolean {
    return this.Tags.some(x => x.IsLimited)
  }

  public get IsDestroyed(): boolean {
    return this._destroyed
  }

  public Destroy(): void {
    this._destroyed = true
    this.save()
  }

  public Repair(): void {
    this._destroyed = false
    this.save()
  }

  public get Uses(): number {
    return this._uses
  }

  public set Uses(val: number) {
    this._uses = val
    this.save()
  }

  public get MaxUses(): number {
    if (!this.IsLimited) return 0
    const limVal = this.Tags.find(x => x.IsLimited).Value
    return typeof limVal === 'number' ? limVal : 0
  }
}

export default MechEquipment