const main = () => {
  window.HOME_INJECTED = true;
  console.log('%c  UFCG-PRO injected  ', 'background-color: #049; color: white; font-weight: bold; font-size: 30px');
  console.log('existe ufcg? ', !!window.ufcg);
};

if (!window.HOME_INJECTED) {
  main();
}
