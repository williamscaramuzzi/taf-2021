//arquivo feito pra garantirmos que certas paginas so serão mostradas para usuarios autenticados
//se a gente coloca o framework sessions pra funcionar, e faz corretamente o serialize e deserialize do user quando ele loga
//então o user estará disponível na variavel session
//esse req.isAutenticated é uma função do passport
//ela implementa uma checagem de req.session.passport.user, se existe ou se é undefined
//é melhor fazer isso aqui em um arquivo separado, do que abrir mais uma arrow function no reouter.get da página
module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "É necessário fazer Login");
    res.redirect("/");
  }
};
