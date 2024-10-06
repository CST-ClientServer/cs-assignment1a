package com.cardgameserver.logging;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;

@Aspect
public class LoggingAspect {

    @Pointcut("execution(* com.cardgameserver.dao.*.*(..))")
    public void allDaoMethods() {}

    @Before("allDaoMethods()")
    public void logBeforeMethod(JoinPoint joinPoint) {
        System.out.println("@@@ Before invoke method: " + joinPoint.getSignature().getName() + " method start.");
    }

    @After("allDaoMethods()")
    public void logAfterMethod(JoinPoint joinPoint) {
        System.out.println("@@@ After invoke method: " + joinPoint.getSignature().getName() + " method done.");
    }

    @Around("allDaoMethods()")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();

        Object result = joinPoint.proceed();

        long timeTaken = System.currentTimeMillis() - startTime;
        System.out.println(joinPoint.getSignature().getName() + " Method " + timeTaken + " ms spent.");

        return result;
    }
}
