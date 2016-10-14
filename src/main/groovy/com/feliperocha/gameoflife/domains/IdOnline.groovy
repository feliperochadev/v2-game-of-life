package com.feliperocha.gameoflife.domains

import javax.persistence.Entity
import javax.persistence.Id

@Entity
class IdOnline implements Serializable {
    @Id
    String id
}
