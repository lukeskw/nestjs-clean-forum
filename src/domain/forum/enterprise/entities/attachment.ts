import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'

type AttachmentProps = {
  title: string
  link: string
}

export class Attachment extends Entity<AttachmentProps> {
  get title(): string {
    return this.props.title
  }

  get link(): string {
    return this.props.link
  }

  static create(props: AttachmentProps, id?: UniqueEntityID) {
    const attachment = new Attachment(props, id)

    return attachment
  }
}
