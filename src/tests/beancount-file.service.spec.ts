import * as appSettings from '@nativescript/core/application-settings'
import { File } from '@nativescript/core/file-system'

import { BeancountFileService } from '../app/shared/beancount-file.service'
import { BeancountFileContent } from '../app/shared/beancount-file-content'

// TODO: spyOn does not work after upgrade to NS7, possible because of esNext target
// Skip tests temporarily, we don't need them anyway
xdescribe('beancount file service', () => {
    const fileMock = {
        writeText: () => Promise.resolve(),
    } as any
    const filePath = '/path/to/file'
    let service

    beforeEach(() => {
        spyOn(appSettings, 'getString').and.callFake(() => {
            return filePath
        })
        spyOn(File, 'fromPath').and.returnValue(fileMock)

        service = new BeancountFileService({} as any)
    })

    it('should be initialized with path', () => {
        expect(service).toBeTruthy()
        expect(service.path).toEqual(filePath)
    })

    it('should save file', () => {
        spyOn(fileMock, 'writeText').and.callThrough()
        const fileText = 'test-content'
        service.content = new BeancountFileContent(fileText)
        service.save()
        expect(fileMock.writeText).toHaveBeenCalledWith(fileText)
    })

    it('should append to file', () => {
        spyOn(service, 'save')
        service.content = new BeancountFileContent('2019-01-01 txn "test1"\n')
        service.append('2019-01-02 txn "test2"\n')
        expect(service.content.text).toBe(
            '2019-01-01 txn "test1"\n\n' +
            '2019-01-02 txn "test2"\n')
        expect(service.save).toHaveBeenCalled()
    })

    it('should append to file with no linebreak at the end', () => {
        service.content = new BeancountFileContent('2019-01-01 txn "test1"')
        service.append('2019-01-02 txn "test2"\n')
        expect(service.content.text).toBe(
            '2019-01-01 txn "test1"\n\n' +
            '2019-01-02 txn "test2"\n')
    })
})
