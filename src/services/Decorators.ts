import { createElLoading } from "@/components/loading";
import type { Ref } from "vue";
//在 TypeScript 里，装饰器是一种特殊的声明，能够被附加到类声明、方法、属性或者参数上，从而对它们进行元编程。装饰器本质上是一个函数，这个函数会接收特定的参数并返回一个新的属性描述符（PropertyDescriptor），以此来修改被装饰对象的行为。
/**
 *
 * @param dataR 缓存对象
 * @param replace 默认值false，基于缓存决定是否执行业务方法；true，执行业务方法，并将结果置于缓存
 * @returns 缓存对象，或更新后的缓存对象
 */
// _: any：
// 这是装饰器函数的第一个参数，通常表示被装饰的目标对象（类的原型）。在 TypeScript 里，当使用方法装饰器时，第一个参数就是类的原型对象。这里使用下划线 _ 作为参数名，是一种常见的约定，表示这个参数在当前装饰器逻辑中不会被使用，以此来避免未使用变量的警告。
// __: string：
// 这是装饰器函数的第二个参数，代表被装饰的方法名。同样，使用双下划线 __ 作为参数名，表明这个参数在当前装饰器逻辑中不会被使用。
// descriptor: PropertyDescriptor：
// 这是装饰器函数的第三个参数，是一个 PropertyDescriptor 类型的对象。PropertyDescriptor 是 JavaScript 中用于描述对象属性的一种数据结构，它包含了属性的一些特性，例如 value（属性的值）、writable（属性是否可写）、enumerable（属性是否可枚举）、configurable（属性是否可配置）等。在方法装饰器中，descriptor 描述的就是被装饰方法的属性信息，你可以通过修改这个描述符来改变方法的行为。
// 返回值部分
// 装饰器函数最终会返回一个新的 PropertyDescriptor 对象，这个对象会替换掉原来的属性描述符，从而实现对被装饰方法的修改。在你给出的代码中，通常会在返回之前对 descriptor 进行修改，例如重写 descriptor.value 为一个新的函数，以此来改变原方法的行为。
export function StoreCache(dataR: Ref<any>, replace = false) {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    //保存原方法
    const originalMethod = descriptor.value;
   // 重写 descriptor.value 为一个异步函数
    descriptor.value = async (...args: any[]) => {
      const val = dataR.value;
      // 响应式对象存在，直接返回
      if (!replace && val) {
        //Promise.resolve 方法用于将一个值转换为一个 Promise 对象，并且这个 Promise 对象会以传入的值作为成功的结果进行解析（resolved）。也就是说，它会创建一个已经解决（resolved）状态的 Promise 对象，这个对象会立即进入 fulfilled（已成功）状态，并且将传入的值作为 then 方法回调函数的参数。
        return Promise.resolve(dataR);
      }
      // 异步执行目标方法并将结果置于store
      //这行代码的主要功能是调用原始方法 originalMethod，并传入指定的参数 args，同时使用 await 关键字等待该方法执行完成（如果该方法返回一个 Promise）。apply 方法用于指定函数执行时的 this 值以及参数列表。
      const r = await originalMethod.apply(descriptor, args);
      return (dataR.value = r) && dataR;
    };
    return descriptor;
  };
}

/**
 *
 * @param dataR 封装Map类型的响应式对象
 * @param indexs 用于拼接Map键的方法参数索引位置。默认按方法参数顺序拼接键
 * @returns Map中proxy类型元素
 */
//该装饰器用于使用 Map 来缓存方法的执行结果。根据方法的参数生成一个键，检查该键对应的缓存值是否存在，如果存在则直接返回，否则执行原方法并将结果存入 Map 中。
export function StoreMapCache(dataR: Ref<Map<any, any>>, indexs?: number[]) {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async (...args: any[]) => {
      const val = dataR.value;
      let mapKey = args.join("-");
      if (indexs) {
        const temp: any = [];
        for (const index of indexs) {
          temp.push(args[index]);
        }
        mapKey = temp.join("-");
      }
      const mapValue = val.get(mapKey);
      // 响应式对象存在，直接返回
      if (mapValue) {
        return Promise.resolve(mapValue);
      }
      // 响应式对象不存在。异步执行目标方法并将结果置于store
      const r = await originalMethod.apply(descriptor, args);
      val.set(mapKey, r);
      return val.get(mapKey);
    };
    return descriptor;
  };
}

// 注入clear函数数组
//该装饰器用于在执行原方法之前，依次调用传入的清除函数。
export function StoreClear(...clears: Function[]) {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = (...args: any[]) => {
      for (const clear of clears) {
        clear();
      }
      return originalMethod.apply(descriptor, args);
    };
    return descriptor;
  };
}
//该装饰器用于在执行原方法时显示加载状态，原方法执行完毕后关闭加载状态。
export function ELLoading() {
  return (_: any, __: string, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = async (...args: any[]) => {
      let r;
      const loading = createElLoading();
      try {
        r = await originalMethod.apply(descriptor, args);
      } finally {
        loading.close();
      }
      return r;
    };
    return descriptor;
  };
}
