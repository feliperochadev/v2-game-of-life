package com.feliperocha.gameoflife.repositories

import com.feliperocha.gameoflife.domains.IdOnline
import org.springframework.data.repository.CrudRepository
import org.springframework.stereotype.Repository

@Repository
interface IdOnlineRepository extends CrudRepository<IdOnline, String> {

}
