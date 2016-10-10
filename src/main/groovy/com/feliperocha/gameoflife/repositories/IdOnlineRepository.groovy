package com.feliperocha.gameoflife.repositories
import org.springframework.stereotype.Repository

@Repository
class IdOnlineRepository {
   def ids = new ArrayList<String>()

    def contains(String id)
    {
        ids.contains(id)
    }

    def addId(String id)
    {
        ids.add(id)
    }

    def deleteId(String id)
    {
        ids.remove(id)
    }
}
