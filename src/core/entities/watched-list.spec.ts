import { WatchedList } from './watched-list'

class NumberWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('Watched List ', () => {
  it('should be able to create a watched list with initial items', () => {
    const initialItems = [1, 2, 3]
    const watchedList = new NumberWatchedList(initialItems)

    expect(watchedList.currentItems).toEqual(initialItems)
    expect(watchedList.currentItems).toHaveLength(3)
  })

  it('should be able to add new items to the watched list', () => {
    const initialItems = [1, 2, 3]
    const watchedList = new NumberWatchedList(initialItems)

    watchedList.add(4)

    expect(watchedList.currentItems).toEqual(initialItems)
    expect(watchedList.currentItems).toHaveLength(4)
    expect(watchedList.getNewItems()).toEqual([4])
  })

  it('should be able to remove items from the watched list', () => {
    const initialItems = [1, 2, 3]
    const watchedList = new NumberWatchedList(initialItems)

    watchedList.remove(2)

    expect(watchedList.currentItems).toHaveLength(2)
    expect(watchedList.getRemovedItems()).toEqual([2])
  })

  it('should be able to add an item even if it was removed before', () => {
    const initialItems = [1, 2, 3]
    const watchedList = new NumberWatchedList(initialItems)

    watchedList.remove(2)

    watchedList.add(2)

    expect(watchedList.currentItems).toHaveLength(3)
    expect(watchedList.getRemovedItems()).toEqual([])
    expect(watchedList.getNewItems()).toEqual([])
  })

  it('should be able to remove an item even if it was added before', () => {
    const initialItems = [1, 2, 3]
    const watchedList = new NumberWatchedList(initialItems)

    watchedList.add(4)

    watchedList.remove(4)

    expect(watchedList.currentItems).toHaveLength(3)
    expect(watchedList.getRemovedItems()).toEqual([])
    expect(watchedList.getNewItems()).toEqual([])
  })

  it('should be able to update watched list items', () => {
    const initialItems = [1, 2, 3]
    const watchedList = new NumberWatchedList(initialItems)

    watchedList.update([1, 3, 5])

    expect(watchedList.currentItems).toHaveLength(3)
    expect(watchedList.getRemovedItems()).toEqual([2])
    expect(watchedList.getNewItems()).toEqual([5])
  })
})
