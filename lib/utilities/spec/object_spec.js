/**
 * Copyright 2016 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import * as object from '../object';

describe( 'Object utilities', () => {

   describe( 'path( Object, String[, default] )', () => {

      let obj;

      beforeEach( () => {
         obj = {
            zero: null,
            one: {
               two: 2
            },
            three: 3,
            arr: [ {
               name: 'Peter',
               '': { x: 'y' }
            }, {
               name: 'Hans',
               '': 'secret'
            } ],
            '': {
               '': 'top secret'
            }
         };
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'returns the given value if it exists', () => {
         expect( object.path( obj, 'one.two' ) ).toBe( 2 );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'returns the default value if it does not exist', () => {
         expect( object.path( obj, 'one.twoo', 666 ) ).toBe( 666 );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'returns the default value if any part of the path is falsy', () => {
         expect( object.path( obj, 'zero.one', 666 ) ).toBe( 666 );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'returns the default value if any part of the path is not an object', () => {
         expect( object.path( obj, 'one.two.three', 666 ) ).toBe( 666 );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'returns undefined if it does not exist and no default is given', () => {
         expect( object.path( obj, 'one.twoo' ) ).not.toBeDefined();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'can resolve array indices within paths', () => {
         expect( object.path( obj, 'arr.0.name' ) ).toEqual( 'Peter' );
         expect( object.path( obj, 'arr.1.name' ) ).toEqual( 'Hans' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'aborts when encountering an empty segment', () => {
         expect( object.path( obj, '' ) ).toEqual( obj );
         expect( object.path( obj, '.' ) ).toEqual( obj );
         expect( object.path( obj, 'zero.' ) ).toEqual( object.path( obj, 'zero' ) );
         expect( object.path( obj, 'one..' ) ).toEqual( object.path( obj, 'one' ) );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'setPath( Object, String, Object )', () => {

      let obj;

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      beforeEach( () => {
         obj = {
            listOfStrings: [ 'A', 'B', 'C' ],
            level1: {
               value: 'ABC',
               level2: {
                  value: 'DEF'
               }
            }
         };
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'adds missing array elements at the specified position, setting inner values to null', () => {
         object.setPath( obj, 'listOfStrings.5', 'Y' );

         expect( obj.listOfStrings[ 4 ] ).toBe( null );
         expect( obj.listOfStrings[ 5 ] ).toEqual( 'Y' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'adds non existing paths for arrays', () => {
         object.setPath( obj, 'lists.0.objects.4.value', 'B' );

         expect( obj.lists.length ).toBe( 1 );
         expect( obj.lists[ 0 ].objects.length ).toBe( 5 );
         expect( obj.lists[ 0 ].objects[ 0 ] ).toBe( null );
         expect( obj.lists[ 0 ].objects[ 1 ] ).toBe( null );
         expect( obj.lists[ 0 ].objects[ 2 ] ).toBe( null );
         expect( obj.lists[ 0 ].objects[ 3 ] ).toBe( null );
         expect( obj.lists[ 0 ].objects[ 4 ].value ).toEqual( 'B' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'supports empty segments in paths', () => {
         object.setPath( obj, '', 'Y' );
         expect( obj[ '' ] ).toBe( 'Y' );

         object.setPath( obj, 'lists.0..4.value', 'Z' );
         const expected = { '': [ null, null, null, null, { value: 'Z' } ] };
         expect( object.path( obj, 'lists.0' ) ).toEqual( expected );

         object.setPath( obj, '.', 'Y' );
         expect( obj[ '' ] ).toEqual( { '': 'Y' } );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'deepClone( Object )', () => {

      let obj;
      let clone;

      beforeEach( () => {
         obj = {
            wife: {
               name: 'Gisela',
               age: 65
            },
            car: {
               manufacturer: 'Mercedes',
               color: 'grey'
            },
            pets: [ 'dog', 'cat' ],

            aNullValue: null,

            anUndefinedValue: undefined
         };

         clone = object.deepClone( obj );
         clone.wife.name = 'Henrietta';
         clone.pets.push( 'mouse' );
         clone.pets[ 0 ] = 'tiger';
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'creates a deep clone', () => {
         expect( obj.wife.name ).toEqual( 'Gisela' );
         expect( obj.pets ).toEqual( [ 'dog', 'cat' ] );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'returns null as is', () => {
         expect( clone.aNullValue ).toBeNull();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'returns undefined as is', () => {
         expect( clone.anUndefinedValue ).toBeUndefined();
      } );
   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'forEach( obj, iteratorFunction )', () => {

      let iteratorSpy;

      beforeEach( () => {
         iteratorSpy = jasmine.createSpy( 'iteratorSpy' );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'calls an iterator function for each entry in an object', () => {
         const obj = {
            one: 'eins',
            two: 'zwei',
            three: 3
         };
         object.forEach( obj, iteratorSpy );

         expect( iteratorSpy ).toHaveBeenCalledWith( 'eins', 'one', obj );
         expect( iteratorSpy ).toHaveBeenCalledWith( 'zwei', 'two', obj );
         expect( iteratorSpy ).toHaveBeenCalledWith( 3, 'three', obj );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'calls an iterator function for each entry in an array', () => {
         const arr = [ 'eins', 'zwei', 3 ];
         object.forEach( [ 'eins', 'zwei', 3 ], iteratorSpy );

         expect( iteratorSpy ).toHaveBeenCalledWith( 'eins', 0, arr );
         expect( iteratorSpy ).toHaveBeenCalledWith( 'zwei', 1, arr );
         expect( iteratorSpy ).toHaveBeenCalledWith( 3, 2, arr );
      } );

   } );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   describe( 'options( options, defaults )', () => {

      let options;
      let defaults;

      beforeEach( () => {
         options = {
            pollingMillis: 200
         };
         defaults = {
            pollingMillis: 100,
            pollingTimeout: 1000
         };
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'returns options where missing properties are filled with given defaults', () => {
         expect( object.options( options, defaults ) ).toEqual( {
            pollingMillis: 200,
            pollingTimeout: 1000
         } );
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'doesn\'t modify the passed options', () => {
         object.options( options, defaults );
         expect( options.pollingTimeout ).toBeUndefined();
      } );

      ////////////////////////////////////////////////////////////////////////////////////////////////////////

      it( 'can handle null or undefined options', () => {
         expect( object.options( null, defaults ) ).toEqual( {
            pollingMillis: 100,
            pollingTimeout: 1000
         } );
         expect( object.options( undefined, defaults ) ).toEqual( {
            pollingMillis: 100,
            pollingTimeout: 1000
         } );
      } );

   } );

} );
